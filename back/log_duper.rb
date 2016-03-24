class LogDuper
  def initialize(array, *targets)
    @array = array
    @targets = targets
  end

  def write(*args)
    @array.unshift(args.first)
    @targets.each { |t| t.write(*args) }
  end

  def close
    @targets.each(&:close)
  end
end
